const dirTree = require('directory-tree');
const path = require('path');
const fs = require('fs');
const srcpath1 = path.resolve(__dirname, "../学习笔记")
const srcpath2 = srcpath1.replaceAll(path.sep, '/')
console.log("123", srcpath1, srcpath2, path.sep)

function transUpperInFisrtLetter(str) {
    return str.charAt(0).toUpperCase() + str.substring(1, str.length);
}

function list(srcpath, exclude = {}, level = 1) {
    var sidebarTxt = '';
    const srcDir = dirTree(srcpath, exclude);
    const repeats = '   '.repeat(level)
        // console.log(srcDir)
        // sidebarTxt += '- ' + srcDir.path + '';
    if (srcDir.children != null) {
        level++;
        var sidebarTxt1 = '';
        srcDir.children.forEach((item) => {
            console.log(item.path, srcpath2)
            if (item.children != null) {
                var str = list(item.path, exclude, level)
                sidebarTxt1 += '\n' + repeats + '- ' + transUpperInFisrtLetter(item.name).replace(" ", "") + str;

            } else {
                sidebarTxt1 += '\n' + repeats + '- [' + transUpperInFisrtLetter(item.name.replace(".md", "")).replace(srcpath1, "学习笔记").replace(" ", "") + '](' +
                    item.path.replace(srcpath2, "/学习笔记") + ')';
            }
        })

        return sidebarTxt + sidebarTxt1;
    } else {
        return sidebarTxt;
    }

}
fs.writeFile(srcpath2.replace("学习笔记", "") + '/_sidebar.md', list(path.resolve(__dirname, "../学习笔记"), {
    extensions: /\.md$/,
    exclude: /\.assets$|node_modules$|\.history$|\.vitepress$|(.+?)examples|图灵商城|Python|公司文档|分析图|自动化运维|截图|assets|_sidebar/,
    normalizePath: true,
    type: ""
}), function(err) {
    if (err) {
        //console.error(err);
    }
});