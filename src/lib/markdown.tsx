import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Separator } from "@/components/ui/separator"
import { TH1 } from "@/components/typography/h1"
import { TH2 } from "@/components/typography/h2"
import { TH3 } from "@/components/typography/h3"
import { TList } from "@/components/typography/list"
import { TypographyP as P } from "@/components/typography/p"

// Custom Markdown renderer
export const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Override <a> to use Next.js Link + handle social icons
        a: ({ href, children }) => {
          if (!href) return <>{children}</>

          return (
            <Link href={href} className="text-[#ed1e37] underline underline-offset-2">
              {children}
            </Link>
          )
        },
        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        // Custom Underline: __text__ → <span className="underline">text</span>
        u: ({ children }) => <span className="underline">{children}</span>,
        h1: ({ children }) => <TH1>{children}</TH1>,
        h2: ({ children }) => <TH2>{children}</TH2>,
        h3: ({ children }) => <TH3>{children}</TH3>,
        // Override paragraph spacing
        p: ({ children }) => <P className="rounded border border-black px-4 py-2">{children}</P>,
        // Override lists for better spacing
        ul: ({ children }) => <TList>{children}</TList>,
        ol: ({ children }) => <ol className="list-inside list-decimal">{children}</ol>,
        hr: () => <Separator className="bg-gray-300" />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
