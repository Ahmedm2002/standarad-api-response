import API_RES from "../utils/ApiRes.js";

import { Router } from "express";

const router = Router();

router.get("/health-check", (req, res) => {
  return res.status(200).json(
    new API_RES(true, 200, "Api Working fine", {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    })
  );
});

export default router;
