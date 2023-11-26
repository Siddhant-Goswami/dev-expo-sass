import Image from 'next/image';

type ProjectCardProps = {
  projectName: string;
  creator: string;
  media: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    projectId: number;
    type: string;
    url: string;
  }[];
  tags: {
    projectId: number;
    tagId: number;
  }[];
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectName,
  creator,
  tags,
  media,
}) => {
  return (
    <div className="rounded-sm">
      <div className="group relative h-64 overflow-hidden  rounded-sm sm:h-56">
        <Image
          fill={true}
          src={
            media?.[0]?.type === 'image'
              ? media?.[0]?.url
              : 'https://images.unsplash.com/photo-1597484661973-ee6cd0b6482c?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
          alt="demo"
        />
        <h2 className="absolute bottom-0 z-10 w-full px-4 py-3 text-xl font-semibold text-transparent transition-all duration-200 group-hover:bg-blackGradient group-hover:text-white">
          {projectName}
        </h2>
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-center text-sm font-medium">{creator}</span>
        <span className="text-center text-xs font-medium text-gray-700">
          {tags.map((tag, index) => {
            return index === tags.length - 1 ? (
              <span className="ml-1">#{tag.tagId}</span>
            ) : (
              <span className="ml-1">#{tag.tagId},</span>
            );
          })}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
