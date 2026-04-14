type Props = { message: string | null };

export default function ServerError({ message }: Props) {
  if (!message) return null;
  return <p className='text-red-500 text-sm'>{message}</p>;
}
