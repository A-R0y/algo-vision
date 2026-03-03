import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarkCompletedButtonProps {
  algorithmName: string;
  isCompleted: boolean;
  onMark: (name: string) => void;
  loading?: boolean;
}

const MarkCompletedButton = ({ algorithmName, isCompleted, onMark, loading }: MarkCompletedButtonProps) => {
  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled className="font-mono text-xs">
        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (isCompleted) {
    return (
      <Button variant="outline" size="sm" disabled className="font-mono text-xs border-success/50 text-success">
        <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
        Completed
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onMark(algorithmName)}
      className="font-mono text-xs hover:border-success/50 hover:text-success transition-colors"
    >
      <Circle className="h-3.5 w-3.5 mr-1.5" />
      Mark as Completed
    </Button>
  );
};

export default MarkCompletedButton;
