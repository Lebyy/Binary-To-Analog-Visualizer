// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const { createCanvas } = require("@napi-rs/canvas");

type Data = {
  image?: string
  width?: number
  height?: number
  error?: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    let bitStream = req.query.bitStream as any;
    if(!bitStream) {
        res.status(400).json({ error: "No bitstream provided" });
        return;
    };

    bitStream = bitStream.replace(/\s/g, "").split("");

    bitStream = bitStream.map((bit: string) => parseInt(bit));

    if(bitStream.length > 1000) {
        res.status(400).json({ error: "Bitstream must be less than 1000 bits" });
        return;
    };

    // Check if bit stream only contains 0s and 1s
    for(let i = 0; i < bitStream.length; i++) {
        if(bitStream[i] !== 0 && bitStream[i] !== 1) {
            res.status(400).json({ error: "Bitstream must only contain 0s and 1s" });
            return;
        };
    };

    // Create a canvas large enough to fit the entire bit stream, 200 pixels per bit and 3 sine waves per bit.
    const canvas = createCanvas(bitStream.length * 200, 3 * 500);
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#FFFFFF";
    ctx.fillStyle = "#03a9f4";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fontWeight = "bold";
    ctx.fontFamily = "Helvetica";
    ctx.font = "30px Helvetica";
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    for (let i = 0; i < bitStream.length; i++) {
      const x = i * 200;
      const y = 100;

      ctx.beginPath();
      ctx.setLineDash([10, 15]);
      ctx.moveTo(x + 200, y);
      ctx.lineTo(x + 200, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    for (let i = 0; i < bitStream.length; i++) {
      const x = i * 200;
      const y = 100;
      const height = 100;
      const bit = bitStream[i];

      if (bit === 1) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - height);
        ctx.lineTo(x + 200, y - height);
        ctx.lineTo(x + 200, y);
        ctx.fillText(bit === 1 ? "1" : "0", x + 100, y - 50);
        ctx.stroke();
      } else {
        // Create a line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 200, y);
        ctx.fillText(bit === 1 ? "1" : "0", x + 100, y + 50);
        ctx.stroke();
      }

      // Draw a circle at the end of the line
      ctx.beginPath();
      ctx.arc(x + 200, y, 10, 0, 2 * Math.PI);
      ctx.stroke();

      // Write "Message Signal" at the bottom of the rectangles, make sure it is centered.
      ctx.fillText("Message Signal", bitStream.length * 100, 200);
    }

    for (let i = 0; i < bitStream.length; i++) {
      const x = i * 200;
      const y = 400;
      const amplitude = 50;
      const frequency = 0.1;
      const phase = 0;

      // Draw a circle, at the end of the grid allocated for the sine wave.
      ctx.beginPath();
      ctx.arc(x + 200, y, 10, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let j = 0; j < 200; j++) {
        const x1 = x + j;
        const y1 = y + amplitude * Math.sin(frequency * x1 + phase);
        ctx.lineTo(x1, y1);
      }
      ctx.stroke();

      // Write "Carrier Signal" at the bottom of the sine waves, make sure it is centered.
      ctx.fillText("Carrier Signal", bitStream.length * 100, 500);
    }

    // Drawing the ASK modulated signal
    for (let i = 0; i < bitStream.length; i++) {
      const x = i * 200;
      const y = 700;
      const amplitude = 50;
      const frequency = 0.1;
      const phase = 0;
      const bit = bitStream[i];

      // Draw a circle, at the end of the grid allocated for the sine wave.
      ctx.beginPath();
      ctx.arc(x + 200, y, 10, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, y);
      if (bit === 1) {
        for (let j = 0; j < 200; j++) {
          const x1 = x + j;
          const y1 = y + amplitude * Math.sin(frequency * x1 + phase);
          ctx.lineTo(x1, y1);
        }
      } else {
        for (let j = 0; j < 200; j++) {
          const x1 = x + j;
          const y1 = y;
          ctx.lineTo(x1, y1);
        }
      }
      ctx.stroke();

      // Write "ASK Modulated Signal" at the bottom of the sine waves, make sure it is centered.
      ctx.fillText("ASK Modulated Signal", bitStream.length * 100, 800);
    }

    // Drawing the FSK modulated signal
    for (let i = 0; i < bitStream.length; i++) {
      const x = i * 200;
      const y = 1000;
      const amplitude = 50;
      const frequency = 0.1;
      const phase = 0;
      const bit = bitStream[i];

      // Draw a circle, at the end of the grid allocated for the sine wave.
      ctx.beginPath();
      ctx.arc(x + 200, y, 10, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, y);
      if (bit === 1) {
        for (let j = 0; j < 200; j++) {
          const x1 = x + j;
          const y1 = y + amplitude * Math.sin(0.25 * x1 + phase);
          ctx.lineTo(x1, y1);
        }
      } else {
        for (let j = 0; j < 200; j++) {
          const x1 = x + j;
          const y1 = y + amplitude * Math.sin(frequency * x1 + phase);
          ctx.lineTo(x1, y1);
        }
      }
      ctx.stroke();

      // Write "FSK Modulated Signal" at the bottom of the sine waves, make sure it is centered.
      ctx.fillText("FSK Modulated Signal", bitStream.length * 100, 1100);
    }

    // Drawing the PSK modulated signal
    for (let i = 0; i < bitStream.length; i++) {
      const x = i * 200;
      const y = 1300;
      const amplitude = 50;
      const frequency = 0.1;
      const phase = 0;
      const bit = bitStream[i];

      // Draw a circle, at the end of the grid allocated for the sine wave.
      ctx.beginPath();
      ctx.arc(x + 200, y, 10, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, y);
      if (bit === 1) {
        for (let j = 0; j < 200; j++) {
          const x1 = x + j;
          const y1 = y + amplitude * Math.sin(frequency * x1 + phase + Math.PI);
          ctx.lineTo(x1, y1);
        }
      } else {
        for (let j = 0; j < 200; j++) {
          const x1 = x + j;
          const y1 = y + amplitude * Math.sin(frequency * x1 + phase);
          ctx.lineTo(x1, y1);
        }
      }
      ctx.stroke();

      // Write "PSK Modulated Signal" at the bottom of the sine waves, make sure it is centered.
      ctx.fillText("PSK Modulated Signal", bitStream.length * 100, 1400);
    }

    // Output the canvas to svg
    const buffer = canvas.toBuffer("image/png");

    // Return the svg
    res.status(200).json({
        image: buffer.toString("base64"),
        width: canvas.width,
        height: canvas.height
    });
}
