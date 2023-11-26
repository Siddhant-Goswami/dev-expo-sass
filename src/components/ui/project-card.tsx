import Image from 'next/image';

type ProjectCardProps = {
  projectName: string;
  creator: string;
  tags: string[];
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectName,
  creator,
  tags,
}) => {
  return (
    <div className="rounded-sm">
      <div className="group relative h-64 overflow-hidden  rounded-sm sm:h-56">
        <Image fill={true} src="/images/demo.png" alt="demo" />
        <h2 className="absolute bottom-0 z-10 w-full px-4 py-3 text-xl font-semibold text-transparent transition-all duration-200 group-hover:bg-blackGradient group-hover:text-white">
          {projectName}
        </h2>
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-center text-sm font-medium">{creator}</span>
        <span className="text-center text-xs font-medium text-gray-700">
          {tags.map((tag, index) => {
            return index === tags.length - 1 ? (
              <span className="ml-1">#{tag}</span>
            ) : (
              <span className="ml-1">#{tag},</span>
            );
          })}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
