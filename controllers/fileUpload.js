const { render } = require("ejs");
const File = require("../models/File");
const path = require("path");
const cloudinary = require("cloudinary").v2;

exports.localFileUpload = async (req, res) => {
  try {
    const file = req.files.file;

    // Validate file existence
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select a file.",
      });
    }
    console.log("File", file);
    let uploadpath =
      __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;

    // const uploadpath = __dirname + "/files/" + Date.now() + path.extname(file.name);

    console.log(uploadpath);

    file.mv(uploadpath, (err) => {
      console.log(err);
    });

    const fileData = await File.create({
      name: file.name,
      imageUrl: `file/${file.name}`,
    });

    res.json({
      status: true,
      message: "file uploaded",
    });
  } catch (error) {
    console.log(error);
  }
};

// This function verifies whether the type of image includes in the supported array
function isFileTypeSupported(type, supportedFileType, fileSize) {
  const max_size = 5 * 1024 * 1024; //5MB
  console.log(fileSize);
  console.log(type);
  console.log(max_size);
  if (fileSize > max_size) {
    return {
      success: false,
      message: "Video size should not exceed 5 MB",
    };
  }
  return supportedFileType.includes(type);
}

// Upload file to couldinary
async function uploadFileToCloudinary(file, folder) {
  const options = { folder };
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Image upload on cloudinary
exports.imageUpload = async (req, res) => {
  try {
    const { name, email, tags } = req.body;
    console.log(name, email, tags);

    const file = req.files.image;

    // Validate file existence
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select an image file.",
      });
    }
    console.log(file);

    const supportedType = ["jpg", "jpeg", "png"];
    // const fileType = path.extname(file.name).toLowerCase();
    // or
    const fileType = `${file.name.split(".")[1]}`.toLowerCase();

    // If file format not supported
    if (!isFileTypeSupported(fileType, supportedType, file.size)) {
      return res.status(400).json({
        success: false,
        message: "Formate not supported",
      });
    }

    // If file format supported
    console.log("uploading to images");
    const response = await uploadFileToCloudinary(file, "images");
    console.log(response);
    // save in db
    const fileData = await File.create({
      name: name,
      tags: tags,
      email: email,
      imageUrl: response.secure_url,
    });

    res.json({
      status: true,
      message: "file uploaded to cloudinary",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: error,
    });
  }
};

// Get data
exports.getImages = async (req, res) => {
  try {
    const images = await File.find();
    res.json({
      status: true,
      message: "images fetches",
      data: images,
    });
  } catch (error) {
    console.log(error);
  }
};

// video upload
exports.videoFileUpload = async (req, res) => {
  try {
    const { name, email, tags } = req.body;
    console.log(name, email, tags);

    const file = req.files.file;

    // Validate file existence
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select a video file.",
      });
    }

    const supportedType = [".mp4", ".mov"];
    const fileType = path.extname(file.name).toLowerCase();

    // If file format not supported
    if (!isFileTypeSupported(fileType, supportedType, file.size)) {
      return res.status(400).json({
        success: false,
        message: "Formate not supported",
      });
    }

    // If file format supported
    console.log("uploading video to images folder");
    const response = await uploadFileToCloudinary(file, "images");
    console.log(response);
    // save in db
    const fileData = await File.create({
      name: name,
      tags: tags,
      email: email,
      videoUrl: response.secure_url,
    });

    res.json({
      status: true,
      message: "video uploaded to cloudinary",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: error,
    });
  }
};

// for size reducer
function isReduceFileTypeSupported(type, supportedFileType) {
  return supportedFileType.includes(type);
}

async function uploadReduceFileToCloudinary(file, folder, quality) {
  const options = { folder };
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Image size reducer
exports.imageReduceUpload = async (req, res) => {
  try {
    // res.send(req.body);
    const { name, email, tags } = req.body;
    console.log(name, email, tags);

    const file = req.files.file;

    // Validate file existence
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select an image file.",
      });
    }
    console.log(file);

    const supportedType = ["jpg", "jpeg", "png"];
    // const fileType = path.extname(file.name).toLowerCase();
    // or
    const fileType = `${file.name.split(".")[1]}`.toLowerCase();
    console.log("file type" + fileType);
    // If file format not supported
    if (!isReduceFileTypeSupported(fileType, supportedType)) {
      return res.status(400).json({
        success: false,
        message: "Formate not supported",
      });
    }

    // If file format supported
    console.log("uploading to images");
    const response = await uploadReduceFileToCloudinary(file, "images", 50);
    console.log(response);
    // save in db
    const fileData = await File.create({
      name: name,
      tags: tags,
      email: email,
      imageUrl: response.secure_url,
    });

    // res.json({
    //   status: true,
    //   message: "file uploaded to cloudinary",
    // });
    const message = `Hello ${name} , Your image uploaded successfully`;
    res.render("form", {
      message: message,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: error,
    });
  }
};

exports.renderView = (req, res) => {
  const name = "Kushank";
  res.render("home", {
    name: name,
  });
};

exports.deleteAllImages = async (req, res) => {
  try {
    const result = await File.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All records deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete records",
      error: error.message,
    });
  }
};
