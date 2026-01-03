import fs from "fs-extra";

export const deleteLocalFile = async (filePath) => {
  try {
    if (filePath && await fs.pathExists(filePath)) {
      await fs.remove(filePath); // Async delete
    }
  } catch (err) {
    console.error(`Failed to delete file ${filePath}:`, err.message);
    // We don't throw here to avoid crashing the main response loop
  }
};