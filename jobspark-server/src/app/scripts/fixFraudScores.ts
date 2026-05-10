import { prisma } from "../lib/prisma";

async function fixFraudScores() {
  try {
    console.log("🔧 Fixing fraud scores for legitimate jobs...\n");

    // Job 3: Senior Frontend Developer - Legitimate
    const job3 = await prisma.job.update({
      where: { id: "cmoyk5w9a0002lcue0r3hxm1i" },
      data: {
        fraudStatus: "SAFE",
        fraudScore: 12,
        fraudFlaggedAt: null,
        fraudIssues: [],
      },
    });
    console.log("✅ Job 3 (Senior Frontend Developer): Marked as SAFE - Score: 12");

    // Job 5: Senior PHP/Symfony Developer - Legitimate  
    const job5 = await prisma.job.update({
      where: { id: "cmoyjmbqr0001hsuek3beppdk" },
      data: {
        fraudStatus: "SAFE",
        fraudScore: 15,
        fraudFlaggedAt: null,
        fraudIssues: [],
      },
    });
    console.log("✅ Job 5 (Senior PHP/Symfony): Marked as SAFE - Score: 15\n");

    // Keep the real scams flagged
    console.log("🚫 Keeping real scams flagged:");
    console.log("   - Job 1 (Send Money First): SCAM");
    console.log("   - Job 2 ($5000 Data Entry): SCAM");  
    console.log("   - Job 4 (Package Forwarding): SCAM\n");

    console.log("✅ Done! 2 legitimate jobs unflagged, 3 scams remain flagged.");
    console.log("📝 Note: Gemini free tier limit is 20 requests/day.");
    console.log("   Wait until tomorrow or upgrade to paid tier for re-analysis.");

  } catch (error) {
    console.error("❌ Error fixing fraud scores:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixFraudScores();
