// OpenCV loading function
function loadOpenCV(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.cv) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = '/src/lib/opencv-js-4.5.0.js';
    script.async = true;
    script.onload = () => {
      console.log("OpenCV script loaded");
      const checkOpenCV = () => {
        if (window.cv && window.cv.Mat) {
          console.log("OpenCV is now available");
          resolve();
        } else {
          console.log("Waiting for OpenCV...");
          setTimeout(checkOpenCV, 100);
        }
      };
      checkOpenCV();
    };
    script.onerror = () => {
      reject(new Error("Failed to load OpenCV"));
    };
    document.body.appendChild(script);
  });
}

// Wrapper function to ensure OpenCV is loaded
async function withOpenCV<T>(fn: () => Promise<T>): Promise<T> {
  if (!window.cv) {
    await loadOpenCV();
  }
  return fn();
}

function isBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
}

function loadImageToMat(imageSrc: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';  // This may be necessary for some image sources
    
    img.onload = function () {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const mat = window.cv.imread(canvas);
          resolve(mat);
        } else {
          reject(new Error("Failed to get canvas context"));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = function (err) {
      reject(new Error("Failed to load image"));
    };
    
    // Check if the input is already a base64 string
    if (isBase64(imageSrc)) {
      img.src = `data:image/png;base64,${imageSrc}`;
    } else if (imageSrc.startsWith('data:image')) {
      // If it's a data URL, use it directly
      img.src = imageSrc;
    } else {
      // If it's a URL, fetch it and convert to base64
      fetch(imageSrc)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = function() {
            img.src = reader.result as string;
          }
          reader.readAsDataURL(blob);
        })
        .catch(error => reject(error));
    }
  });
}

// In the templateMatchingWithNMS function:
export const templateMatchingWithNMS = async (
  originalImageSrc: string,
  subImageSrc: string,
  matchingNumbers: number,
  threshold = 0.8,
  regionOfInterest: { x: number; y: number; width: number; height: number } | null = null
) => {
  return withOpenCV(async () => {
    const cv = window.cv;

    try {
      // Load images as cv.Mat
      const src = await loadImageToMat(originalImageSrc);
      const template = await loadImageToMat(subImageSrc);

      // Convert images to grayscale for better performance
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
      cv.cvtColor(template, template, cv.COLOR_RGBA2GRAY, 0);

      // Handle Region of Interest (ROI) if provided
      const useROI = regionOfInterest !== null;
      let srcROI = src;
      let roiRect;

      if (useROI) {
        const { x, y, width, height } = regionOfInterest;
        roiRect = new cv.Rect(x, y, width, height);
        srcROI = src.roi(roiRect);
      }

      // Log dimensions
      console.log("Source dimensions:", srcROI.cols, "x", srcROI.rows);
      console.log("Template dimensions:", template.cols, "x", template.rows);

      // Check if the template is larger than the source image
      if (template.cols > srcROI.cols || template.rows > srcROI.rows) {
        throw new Error("Template image is larger than the source image");
      }

      // Create result matrix
      const resultCols = srcROI.cols - template.cols + 1;
      const resultRows = srcROI.rows - template.rows + 1;

      // Check if the result matrix dimensions are valid
      if (resultCols <= 0 || resultRows <= 0) {
        throw new Error("Invalid result matrix dimensions");
      }

      // Check if the result matrix size is too large (e.g., more than 100 million elements)
      const maxElements = 100000000; // Adjust this value based on your requirements
      if (resultCols * resultRows > maxElements) {
        throw new Error("Result matrix is too large. Try using a smaller region of interest or a smaller template image.");
      }

      const result = new cv.Mat(resultRows, resultCols, cv.CV_32FC1);

      // Perform template matching
      const method = cv.TM_CCOEFF_NORMED;
      cv.matchTemplate(srcROI, template, result, method);

      // Find all matches above the threshold
      const matchLocations = [];
      const data = result.data32F;

      for (let i = 0; i < data.length; i++) {
        if (data[i] >= threshold) {
          const y = Math.floor(i / result.cols);
          const x = i % result.cols;
          const matchX = x + (useROI ? roiRect.x : 0);
          const matchY = y + (useROI ? roiRect.y : 0);
          matchLocations.push({ x: matchX, y: matchY, score: data[i] });
        }
      }

      // Sort matches by score in descending order
      matchLocations.sort((a, b) => b.score - a.score);

      // Apply Non-Maximum Suppression (NMS)
      const filteredMatches = nonMaximumSuppression(
        matchLocations,
        template.cols,
        template.rows,
        0.5, // Overlap threshold
        matchingNumbers
      );

      // Clean up to prevent memory leaks
      src.delete();
      template.delete();
      result.delete();
      if (useROI) {
        srcROI.delete();
      }

      // Return the top matches up to the requested number
      return filteredMatches;
    } catch (error) {
      console.error("Error in templateMatchingWithNMS:", error);
      throw error; // Re-throw the error to be caught by the caller
    }
  });
};

// Utility functions (not exported) don't need to use withOpenCV
function nonMaximumSuppression(
  boxes: any[],
  templateWidth: number,
  templateHeight: number,
  overlapThresh: number,
  maxMatches: number
): any[] {
  if (boxes.length === 0) return [];

  // Map boxes to include coordinates and area
  let boxesWithCoords = boxes.map(box => ({
    x1: box.x,
    y1: box.y,
    x2: box.x + templateWidth,
    y2: box.y + templateHeight,
    score: box.score,
    area: templateWidth * templateHeight,
    originalBox: box,
  }));

  // Sort the boxes by score in descending order
  boxesWithCoords.sort((a, b) => b.score - a.score);

  const pick = [];

  while (boxesWithCoords.length > 0) {
    const current = boxesWithCoords.shift();
    if (!current) {
      break;
    }
    pick.push(current.originalBox);

    if (pick.length >= maxMatches) {
      break;
    }

    boxesWithCoords = boxesWithCoords.filter((box) => {
      // Calculate overlap
      const xx1 = Math.max(current.x1, box.x1);
      const yy1 = Math.max(current.y1, box.y1);
      const xx2 = Math.min(current.x2, box.x2);
      const yy2 = Math.min(current.y2, box.y2);

      const w = Math.max(0, xx2 - xx1 + 1);
      const h = Math.max(0, yy2 - yy1 + 1);

      const overlap = (w * h) / box.area;

      // Suppress boxes with high overlap
      return overlap <= overlapThresh;
    });
  }

  return pick;
}
