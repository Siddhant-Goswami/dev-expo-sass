import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';

type RadioBtns = {
  id: string;
  label: string;
};

type RadioBtnsProps = {
  radioArr: RadioBtns[];
};

function RadioBtns({ radioArr }: RadioBtnsProps) {
  return (
    <>
      {radioArr.map((radio) => (
        <div key={radio.id} className="w-full">
          <RadioGroupItem
            value={radio.id}
            id={radio.id}
            className="peer sr-only"
          />
          <Label
            htmlFor={radio.id}
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            {radio.label}
          </Label>
        </div>
      ))}
    </>
  );
}

export default RadioBtns;
