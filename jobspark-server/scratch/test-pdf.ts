
import axios from 'axios';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { PrismaClient } from '@prisma/client';
import { Buffer } from 'buffer';

// Use a simple Prisma client for this test script
const prisma = new PrismaClient();

async function test() {
  try {
    console.log("🔍 Fetching seeker profile...");
    const seeker = await prisma.jobSeekerProfile.findFirst({
        where: { resumeUrl: { not: null } }
    });
    
    if (!seeker) {
        console.log("❌ No seeker with resume found in DB");
        return;
    }
    
    console.log("🌐 Testing with URL:", seeker.resumeUrl);
    const response = await axios.get(seeker.resumeUrl as string, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);
    console.log("📦 Buffer size:", buffer.length);
    
    console.log("📄 Parsing PDF with pdfjs-dist...");
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
    const pdfDoc = await loadingTask.promise;
    console.log(`✅ PDF loaded: ${pdfDoc.numPages} pages`);
    
    let fullText = "";
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    
    console.log("📝 Extracted text length:", fullText.length);
    console.log("📝 Text preview:", fullText.substring(0, 150) + "...");
  } catch (err) {
    console.error("❌ Test failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
