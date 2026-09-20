export default function PageOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute inset-0 bg-[#071A24]/25" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,36,0.38)_0%,rgba(7,26,36,0.30)_45%,rgba(7,26,36,0.52)_100%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,26,36,0.55)_0%,rgba(7,26,36,0.20)_45%,rgba(7,26,36,0.28)_100%)]" />
    </div>
  );
}