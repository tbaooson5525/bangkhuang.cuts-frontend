export default function PageTitle({ text }: { text: string }) {
  return (
    <h1 className='text-[20px] font-semibold tracking-tight text-foreground'>
      {text}
    </h1>
  );
}
