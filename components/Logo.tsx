import Image from 'next/image';
import logo from 'public/favicon.svg';

type Props = {
  width?: number;
  height?: number;
  className?: string;
  isFix?: boolean;
};

export default function Logo(props: Props) {
  const { width=36, height=36, className='rounded img-effect', isFix=true } = props;
  return (
    <Image
      src={logo}
      width={width}
      height={height}
      alt="mdSilo"
      layout={isFix ? "fixed" : "responsive"}
      className={className}
    />
  );
}
