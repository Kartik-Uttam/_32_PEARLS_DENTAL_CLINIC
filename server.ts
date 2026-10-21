import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `You are "Pearl", the caring, knowledgeable AI dental care assistant for 32 Pearls Dental Care, located in Jalahalli East, Bengaluru.
Clinic Background:
- Established: 2008 (18+ years of gentle neighbourhood dental care)
- Address: 6, J & J Complex, Kalathur Layout, Jalahalli East, Bengaluru, Karnataka 560013, India
- Direct phone: +91 90199 53164
- Rating: 4.9/5 stars with 154+ Google reviews

Available Services at 32 Pearls:
1. Dental Fillings: Natural tooth-coloured composite restorations for cavities and chipped teeth.
2. Root Canal Treatment: Gentle modern endodontic therapy with local anaesthesia to relieve toothache and save the natural tooth.
3. Teeth Cleaning: Ultrasonic scaling, plaque/tartar removal, and enamel polishing.
4. Teeth Whitening: Safe clinical brightening for tea/coffee/age stains.
5. Dental Crowns: Durable zirconia and porcelain caps to protect weakened or broken teeth.
6. Tooth Extraction: Comfortable, gentle extractions including wisdom tooth care.
7. General Dentistry: Family consultations, digital X-rays, routine check-ups.
8. Preventive Care: Fluoride protection, fissure sealants, and custom mouthguards.

Guidelines for your responses:
- Tone: Warm, reassuring, compassionate, professional, and clear.
- Format: Use short paragraphs or concise bullet points. Avoid overly dense medical jargon.
- Symptom Guidance: Provide helpful, safe temporary home relief (e.g., warm saltwater rinse, cold compress for swelling, avoiding chewing on sensitive side) while clearly explaining the need for an in-person dental exam.
- Emergency Recognition: If a patient mentions severe facial swelling, difficulty swallowing or breathing, severe bleeding, or traumatic injury, urge them to visit the clinic immediately or call +91 90199 53164 without delay.
- Actionable Help: Remind patients that they can book an appointment directly through this site by clicking the "Book Appointment" button or requesting a preferred date/time.
- Disclaimer: Always maintain that while you offer helpful dental information, you do not provide final diagnostic determinations without an in-person clinical exam by the dentist.`;

// Multi-turn chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'gemini-3.8-flash' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    if (!apiKey) {
      return res.json({
        reply: "Hello! I'm Pearl from 32 Pearls Dental Care in Jalahalli East. While our AI chat server is connecting, you can reach our clinic reception directly at +91 90199 53164 or click the 'Book Appointment' button to submit your visit request!",
      });
    }

    // Map conversation history to Gemini contents format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    let reply = '';

    try {
      const response = await ai.models.generateContent({
        model: model || 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
      reply = response.text || '';
    } catch (primaryErr) {
      console.warn('Primary model error, attempting fallback to gemini-3.1-flash-lite:', primaryErr);
      try {
        const fallbackRes = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
        reply = fallbackRes.text || '';
      } catch (fallbackErr) {
        console.error('All Gemini model attempts encountered temporary limit:', fallbackErr);
      }
    }

    if (!reply) {
      const lastUserMsg = (messages[messages.length - 1]?.content || '').toLowerCase();
      if (lastUserMsg.includes('clean') || lastUserMsg.includes('tartar') || lastUserMsg.includes('scaling')) {
        reply = "Yes! At 32 Pearls Dental Care, we provide professional ultrasonic teeth cleaning (scaling and polishing) to remove tartar, surface stains, and plaque buildup. It usually takes 30-45 minutes and is recommended every 6 months. Would you like to schedule a visit? You can click the 'Book a Visit' button right here!";
      } else if (lastUserMsg.includes('pain') || lastUserMsg.includes('ache') || lastUserMsg.includes('hurt')) {
        reply = "I'm so sorry you're experiencing tooth pain! For immediate temporary comfort at home, try rinsing gently with warm saltwater, take a recommended over-the-counter analgesic if safe for you, and avoid very hot, cold, or hard foods. Because toothaches often signal deep cavities or nerve inflammation, please visit our clinic in Jalahalli East or call us at +91 90199 53164 so our doctor can evaluate it.";
      } else if (lastUserMsg.includes('whiten') || lastUserMsg.includes('bright')) {
        reply = "We offer professional clinical teeth whitening treatments designed to safely lift stains from tea, coffee, and everyday life without weakening your tooth enamel. Ask our dentist about the best option for your shade goals by booking an appointment!";
      } else if (lastUserMsg.includes('root canal') || lastUserMsg.includes('rct')) {
        reply = "Root Canal Treatment at 32 Pearls is performed with modern rotary instruments and gentle local anesthesia to comfortably save your natural tooth from extraction. Most procedures take about 45 to 60 minutes across 1 or 2 visits.";
      } else if (lastUserMsg.includes('where') || lastUserMsg.includes('location') || lastUserMsg.includes('address')) {
        reply = "32 Pearls Dental Care is located at 6, J & J Complex, Kalathur Layout, Jalahalli East, Bengaluru, Karnataka 560013. You can click 'Get Directions' in the Contact section to open Google Maps directly!";
      } else {
        reply = "Thank you for reaching out to 32 Pearls Dental Care in Jalahalli East! Our clinic has been caring for neighbourhood smiles since 2008. Please feel free to ask about our treatments (cleanings, fillings, root canals, crowns, whitening), call us at +91 90199 53164, or tap 'Book a Visit' to schedule an appointment.";
      }
    }

    return res.json({ reply });
  } catch (err: unknown) {
    console.error('Gemini chat error:', err);
    return res.json({
      reply: "Thank you for reaching out to 32 Pearls Dental Care! Our team is available at +91 90199 53164 or you can submit an appointment request using the 'Book Appointment' button on this page.",
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('.', 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('.', 'dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
