const dirTree = require('directory-tree');
const path = require('path');
const fs = require('fs');
const srcpath = path.resolve(__dirname, "../学习笔记")
console.log(srcpath)

function list(srcpath, exclude = {}, level = 1) {
    var sidebarTxt = '';
    const srcDir = dirTree(srcpath, exclude);
    const repeats = '   '.repeat(level)
    console.log(srcDir)
    sidebarTxt += '- ' + srcDir.path + '';

    if (srcDir.children != null) {
        level++;
        var sidebarTxt1 = '';
        srcDir.children.forEach((item) => {
            if (item.children != null) {
                sidebarTxt1 += '\n' + repeats + '- [' + item.name.replace(".md", "").replace(" ", "") + '](' + list(item.path, exclude, level) + ')\n  ';
            } else {
                sidebarTxt1 += '\n' + repeats + '- [' + item.name.replace(".md", "").replace(" ", "") + '](' + item.path + ')';
            }
        })

        return sidebarTxt + sidebarTxt1;
    } else {
        return sidebarTxt;
    }

}
fs.writeFile(path.resolve('./') + '/_sidebar.md', list(path.resolve(__dirname, "../学习笔记"), {
    extensions: /\.md$/,
    exclude: /\.assets$|node_modules$|\.history$|\.vitepress$|(.+?)examples|图灵商城|Python|公司文档|分析图|自动化运维|截图|assets/,
    normalizePath: true,
    type: ""
}), function(err) {
    if (err) {
        //console.error(err);
    }
});