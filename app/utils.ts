import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  unlisted: Boolean
  image?: string
}

function getMDXFiles(dir, baseDir = dir) {
  let results: string[] = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const relativePath = path.relative(baseDir, filePath);
    
    if (fs.statSync(filePath).isDirectory()) {
      // Recursively search subdirectories
      results = results.concat(getMDXFiles(filePath, baseDir));
    } else if (path.extname(file) === '.mdx') {
      results.push(relativePath);
    }
  });

  return results;
}

function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    let filePath = path.join(dir, file)
    let { content, data } = matter(fs.readFileSync(filePath, 'utf-8'))
    let slug = path.basename(file, path.extname(file))

    return {
      metadata: data,
      slug,
      content,
    }
  })
}

export function getBlogPosts() {
  return getPosts('blog')
}

export function getReviewPosts() {
  return getPosts('reviews')
}

function getPosts(postType) {
  return getMDXData(path.join(process.cwd(), 'content', postType))
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}
