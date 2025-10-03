
import { Screen } from '../../types';

export interface ScreenProps {
  screen: Screen;
  answers: Record<string, any>;
  updateAnswer: (id: string, value: any) => void;
  onSubmit: () => void;
  showBack: boolean;
  onBack: () => void;
}