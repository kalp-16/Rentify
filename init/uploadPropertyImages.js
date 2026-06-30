require("dotenv").config();

const fs = require("fs");
const path = require("path");

const { cloudinary } = require("../cloudConfig");

const assetsPath = path.join(
    __dirname,
    "..",
    "images",
    "assets"
);

const imageMap = {};

async function uploadFolder(folderName){

    console.log(`\nUploading ${folderName}...\n`);

    const folderPath = path.join(
        assetsPath,
        folderName
    );

    const files = fs.readdirSync(folderPath);

    imageMap[folderName] = [];

    for(const file of files){

        const filePath = path.join(
            folderPath,
            file
        );

        try{

            const result = await cloudinary.uploader.upload(

                filePath,

                {

                    folder:`Development/${folderName}`

                }

            );

            imageMap[folderName].push({

                url:result.secure_url,

                filename:result.public_id

            });

            console.log(`${file}`);

        }

        catch(err){

            console.log(

                `${file}`,

                err.message

            );

        }

    }

}

async function main(){

    const folders = fs.readdirSync(

        assetsPath

    );

    for(const folder of folders){

        await uploadFolder(folder);

    }

    fs.writeFileSync(

        path.join(

            __dirname,

            "imageMap.json"

        ),

        JSON.stringify(

            imageMap,

            null,

            2

        )

    );

    console.log("\n================================");
    console.log("UPLOAD COMPLETE");
    console.log("imageMap.json created.");
    console.log("================================");
}

main();