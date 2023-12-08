const GradientCard = ({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) => {
  return (
    <>
      <div className="relative flex h-72 w-[316px] flex-col justify-end overflow-hidden rounded-[20px] border border-green-800 p-2 py-1 pb-3">
        <div className="absolute left-[-26px] top-[254px] h-[353px] w-[353px] rounded-full bg-green-600 bg-opacity-70 blur-[370.40px]" />
        <div className="flex h-full w-full items-center justify-items-center">
          {icon}
        </div>
        <div className="bg-neutral-900 bg-opacity-20">{children}</div>
      </div>
    </>
  );
};

export default GradientCard;
