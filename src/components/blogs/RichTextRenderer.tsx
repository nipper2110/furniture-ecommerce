import DOMPurify from "dompurify";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
}

function RichTextRenderer({ content, className }: Props) {
  const santitizedContent = DOMPurify.sanitize(content);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: santitizedContent }}
      className={className}
    />
  );
}

export default RichTextRenderer;
