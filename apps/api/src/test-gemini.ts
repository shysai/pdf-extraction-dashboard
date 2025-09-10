import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent('Hello, are you working?');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API is working!');
    console.log('Response:', text);
  } catch (error) {
    console.error('❌ Gemini API error:', error);
  }
}

testGemini();