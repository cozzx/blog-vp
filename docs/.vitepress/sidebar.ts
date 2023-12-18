// 自动生成侧边栏
import path from 'node:path'
import fs from 'node:fs'

// 文件根目录
const DIR_PATH = path.resolve()
// 白名单,过滤不是文章的文件和文件夹
const WHITE_LIST = ['index.md', '.vitepress', 'node_modules', '.idea', 'assets']


// 判断是否是文件夹
const isDirectory = (path) => fs.lstatSync(path).isDirectory()

// 取差值
const intersections = (arr1, arr2) => Array.from(new Set(arr1.filter((item) => !new Set(arr2).has(item))))

// 把方法导出直接使用
function getList(params, path1, pathname, isFilename) {
    // 存放结果
    const res = []
    // 开始遍历params
    for (let file in params) {
        // 拼接目录
        const dir = path.join(path1, params[file])
        // 判断是否是文件夹
        const isDir = isDirectory(dir)
        if (isDir) {
            // 如果是文件夹,读取之后作为下一次递归参数
            const files = fs.readdirSync(dir)
            const itemList = getList(files, dir, `${pathname}/${params[file]}`, isFilename)
            if (itemList.length > 0) {
              res.push({
                text: params[file],
                collapsible: true,
                collapsed: true,
                items: itemList,
              })
            }
        } else {
            // 获取名字
            const filename = path.basename(params[file]).slice(0, -3)
            const title = isFilename ? filename : get_title(`${pathname}/${params[file]}`)
            // 排除非 md 文件
            const suffix = path.extname(params[file])
            if (suffix !== '.md') {
                continue
            }
            
            res.push({
                text: title,
                link: `${pathname}/${filename}`,
            })
        }
    }
    return res
}

// 获取文件内容中的title
function get_title(file: string): string {
    try {
        const filepath = path.join(DIR_PATH, "docs", file)
        const fileContent = fs.readFileSync(filepath, 'utf8');
        const lines = fileContent.split('\n');
        const count = Math.min(5, fileContent.split('\n').length);
    
        for (let i = 0; i < count; i++) {
          const line = lines[i].trim();
          if (line.startsWith('title:')) {
            return line.substr(line.indexOf('title:') + 6).trim();
          } else if (line.startsWith('# ')) {
            return line.substr(line.indexOf('# ') + 2).trim();
          }
        }
      } catch (error) {
        console.error(error);
      }
      return ''
}

export const set_sidebar = (pathname: string, isFilename: boolean = true) => {
    // 获取pathname的路径
    const dirPath = path.join(DIR_PATH, "docs", pathname)
    // 读取pathname下的所有文件或者文件夹
    const files = fs.readdirSync(dirPath)
    // 过滤掉
    const items = intersections(files, WHITE_LIST)
    // getList 函数后面会讲到
    return getList(items, dirPath, pathname, isFilename)
}
