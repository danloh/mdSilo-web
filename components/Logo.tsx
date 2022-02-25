import Image from 'next/image';
import logo from 'public/favicon.svg';

type Props = {
  width: number;
  height: number;
  className?: string;
};

export default function Logo(props: Props) {
  const { width, height, className = 'rounded' } = props;
  return (
    <Image
      src={logo}
      width={width}
      height={height}
      alt="mdsilo"
      layout="fixed"
      className={className}
    />
  );
}
