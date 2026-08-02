const{ GoogleGenAI}=require("@google/genai");
console.log(process.env.GEMINI_API_KEY);
const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY,});
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Resume= require("../models/Resume");


const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const uploadResume = async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(dataBuffer);

    const prompt = `
You are an expert ATS Resume Analyzer.

Analyze this resume and provide:
1. Resume Score (out of 100)
2. Skills
3. Strengths
4. Weaknesses
5. Improvement Suggestions

Resume:
${pdfData.text}
`;

const response = await ai.models.generateContent({
  model: "models/gemini-3-flash-preview",
  contents: prompt,
});

const savedResume = await Resume.create({
  user: req.user.id,
  fileName: req.file.originalname,
  filePath: req.file.path,
  resumeText: pdfData.text,
  analysis: response.candidates[0].content.parts[0].text,
});

res.status(200).json({
  message: "Resume analyzed and saved successfully",
  data:savedResume,
});

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  uploadResume,
  getMyResumes,
  getResumeById,
  deleteResume,
};