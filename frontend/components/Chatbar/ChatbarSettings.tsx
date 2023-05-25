import { SupportedExportFormats } from '@/types/export';
import { IconFileExport, IconFileSettings } from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { SidebarButton } from '../Sidebar/SidebarButton';
import { ClearConversations } from './ClearConversations';

interface Props {
  apiKey: string;
  conversationsCount: number;
  onApiKeyChange: (apiKey: string) => void;
  onClearConversations: () => void;
  onExportConversations: () => void;
  onImportConversations: (data: SupportedExportFormats) => void;
  onChatSettings: (e: boolean) => void;
}

export const ChatbarSettings: FC<Props> = ({
  conversationsCount,
  onClearConversations,
  onExportConversations,
  onChatSettings,
}) => {
  const { t } = useTranslation('sidebar');
  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      {conversationsCount > 0 ? (
        <ClearConversations onClearConversations={onClearConversations} />
      ) : null}

      <SidebarButton
        text={t('Export conversations')}
        icon={<IconFileExport size={18} />}
        onClick={() => onExportConversations()}
      />

      <SidebarButton
        text={t('Settings')}
        icon={<IconFileSettings />}
        onClick={() => onChatSettings(true)}
      />
    </div>
  );
};
