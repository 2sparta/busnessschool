type LogoProps = {
  className?: string;
};

export function Logo({ className = "" }: LogoProps) {
  return (
    <img
      className={`fined-logo${className ? ` ${className}` : ""}`}
      src="/images/fined-logo.png"
      alt="FinEd — фінансова освіта"
    />
  );
}
