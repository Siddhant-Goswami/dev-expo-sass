import React from 'react';
// If you're using an icon library like react-icons, import the specific icon
// This is just an example, replace with your actual icon import

type ProjectCardProps = {
  // Define props here if needed, for example:
  // title: string;
};

const ProjectCard: React.FC<ProjectCardProps> = (props) => {
  return (
    <div className="w-64 overflow-hidden rounded-xl bg-gray-200 shadow-md">
      <div className="flex items-center justify-between p-4">
        {/* Here you should use the actual icon that represents the 'X' in your card */}
        {/* <XIcon className="h-6 w-6 text-gray-600" aria-hidden="true" /> */}
        <div className="ml-4"> X </div>
      </div>
      Additional content goes here, for example a title using props.title
    </div>
  );
};

export default ProjectCard;
