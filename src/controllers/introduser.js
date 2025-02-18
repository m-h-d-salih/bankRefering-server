import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient({
    log:['query']
});
async function determineBeneficiary(introducerId) {
    if (!introducerId) return null;
  
    const introducer = await prisma.account.findUnique({
      where: { id: introducerId },
    });
    if (!introducer) return null;
  
    const introducerCount = await prisma.account.count({
      where: { introducerId },
    });
  
    if ((introducerCount + 1) % 2 === 1) {
      // Odd count: Introducer is beneficiary
      return introducer.id;
    } else {
      // Even count: Use introducer's beneficiary, if available
      if (!introducer.beneficiaryId) {
        // If beneficiaryId is null, default to introducer
        return introducer.id;
      }
      const introducerBeneficiary = await prisma.account.findUnique({
        where: { id: introducer.beneficiaryId },
      });
      return introducerBeneficiary ? introducerBeneficiary.id : introducer.id;
    }
  }
  
  
  
 export const createIntroducer=async (req, res) => {

    try {
      const { introducerId } = req.body;
      const beneficiaryId = await determineBeneficiary(introducerId);
      
      const newAccount = await prisma.account.create({
        data: { introducerId, beneficiaryId },
      });
  
      if (beneficiaryId) {
        await prisma.account.update({
          where: { id: beneficiaryId },
          data: { balance: { increment: 100 } },
        });
      }
  
      res.json({ message: "Account Created Successfully", newAccount });
    } catch (error) {
      
    }
  };
  
  
  export const getIntroducer= async (req, res) => {
    try {
        const accounts = await prisma.account.findMany();
        res.json(accounts);
    } catch (error) {
        console.error("Error creating account:", error);
      res.status(500).json({ error: "Error creating account", details: error.message });
    }
 
  };