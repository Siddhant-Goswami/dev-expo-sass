import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize';

type MarkdownComponentProps = {
    content: string,
}

function MarkdownComponent({content}:MarkdownComponentProps) {
  return (
    <Markdown 
        components={
            {
            h1: ({node, ...props}) => <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl" {...props} />,
            h2: ({node, ...props}) => <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0" {...props} />,
            h3: ({node, ...props}) => <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight" {...props} />,
            h4: ({node, ...props}) => <h4 className="scroll-m-20 text-xl font-semibold tracking-tight" {...props} />,
            code: ({node, ...props}) => <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold" {...props} />,
            p: ({node, ...props}) => <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />,
            ul: ({node, ...props}) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />,
            a: ({node, ...props}) => <a className="text-blue-500 hover:underline" {...props} />,
            }
        }
        remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
            {content}
    </Markdown>
  )
}

export default MarkdownComponent;