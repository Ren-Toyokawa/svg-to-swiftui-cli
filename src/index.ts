import {readdirSync, readFileSync, writeFile} from "fs"
import { convert } from 'svg-to-swiftui-core'

const svgFileDirPath = "./svg_files";
const outputDir = "./output_code"

const allDirents = readdirSync(svgFileDirPath, { withFileTypes: true });
const fileNames = allDirents.filter(dirent => dirent.isFile()).map(({ name }) => name);

const importSwiftUI = 
`import SwiftUI

`;

const preview = 
`

struct {struct_namme}_Previews: PreviewProvider {
    static var previews: some View {
        {struct_namme}()
            .previewLayout(.fixed(width: 400, height: 400))
    }
}`;


const previewNameRegex = /{struct_namme}/ig
fileNames.forEach(fileName => {
    console.log(`start convert ${fileName}`)
    const regex = /.svg/i;
    const svgFile = readFileSync(svgFileDirPath +"/"+ fileName, "utf8");
    const structName = fileName.replace(regex, '')
    let options = {
        structName: structName,
        precision: 5,
        indentationSize: 4
    };
    const outputSource = convert(svgFile, options);
    const swiftUICode = importSwiftUI + outputSource + preview.replace(previewNameRegex, structName);

    const swiftFileName = fileName.replace(regex, '.swift')
    writeFile(outputDir + "/" + swiftFileName, swiftUICode, (err) => {
        if (err) throw err;
        console.log(`${fileName} conversion is complete`)
    });
})