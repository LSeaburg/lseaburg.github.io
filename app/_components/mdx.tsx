import Link from 'next/link'
import ExportedImage from "next-image-export-optimizer";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import type { MDXRemoteOptions } from "next-mdx-remote-client/rsc";
import remarkGfm from 'remark-gfm'
import { highlight } from 'sugar-high'
import React from 'react'

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function CustomLink(props) {
  let href = props.href

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function Figure(props) {
  return ( 
    <figure className="flex flex-col items-center my-4">
      <RoundedImage src={props.src} alt={props.caption} />
      <figcaption className="mt-2">{props.caption}</figcaption>
    </figure>
  )
}

function RoundedImage(props) {
  return <ExportedImage 
            src = {props.src}
            alt={props.alt} 
            className="rounded-lg relative" 
            width={1000}
            height={1000} />
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children)
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  img: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
  Figure,
}

const options: MDXRemoteOptions = {
  mdxOptions: {
    remarkPlugins: [
      remarkGfm,
    ],
  },
  parseFrontmatter: true,
};

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      options={options}
      components={{ ...components, ...(props.components || {}) }}
    />
  )
}
