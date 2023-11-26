import Link from 'next/link';

function Footer() {
  return (
    <footer className="flex items-center justify-center py-8">
      <span className="text-sm text-accent-foreground">
        © 2023{' '}
        <Link
          href="https://100xengineers.com/"
          className="text-brand font-semibold"
        >
          100xTalent
        </Link>{' '}
        by Codible Ventures LLP
      </span>
    </footer>
  );
}

export default Footer;
