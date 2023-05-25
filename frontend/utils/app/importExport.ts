import {
  ExportFormatV1,
  ExportFormatV2,
  ExportFormatV3,
  LatestExportFormat,
  SupportedExportFormats,
} from '@/types/export';
import { cleanConversationHistory } from './clean';
import jsPDF from 'jspdf';
import { notification } from 'antd';

export function isExportFormatV1(obj: any): obj is ExportFormatV1 {
  return Array.isArray(obj);
}

export function isExportFormatV2(obj: any): obj is ExportFormatV2 {
  return !('version' in obj) && 'folders' in obj && 'history' in obj;
}

export function isExportFormatV3(obj: any): obj is ExportFormatV3 {
  return obj.version === 3;
}

export const isLatestExportFormat = isExportFormatV3;

export function cleanData(data: SupportedExportFormats): LatestExportFormat {
  if (isExportFormatV1(data)) {
    return {
      version: 3,
      history: cleanConversationHistory(data),
      folders: [],
    };
  }

  if (isExportFormatV2(data)) {
    return {
      version: 3,
      history: cleanConversationHistory(data.history || []),
      folders: (data.folders || []).map((chatFolder) => ({
        id: chatFolder.id.toString(),
        name: chatFolder.name,
        type: 'chat',
      })),
    };
  }

  if (isExportFormatV3(data)) {
    return data;
  }

  throw new Error('Unsupported data format');
}

function currentDate() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}-${day}`;
}

export const exportData = () => {
  let history: any = localStorage.getItem('conversationHistory');
  let folders = localStorage.getItem('folders');

  if (history) {
    history = JSON.parse(history);
  }

  if (folders) {
    folders = JSON.parse(folders);
  }

  const data = {
    version: 3,
    history: history || [],
    folders: folders || [],
  } as LatestExportFormat;

  let result: string = '';
  console.log('-----------------------', history);
  if (history != null) {
    history[0].messages.forEach((row: any) => {
      if (row.role == 'assistant') {
        result += row.content;
        console.log('asdfasdf', row.content);
      }
      result += '\n';
    });
  }

  if (result != '') {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    });

    const lines = doc.splitTextToSize(result, 190);

    doc.text(lines, 10, 10);
    const pdfBlob = doc.output('blob');

    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.download = `report${currentDate()}.pdf`;
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notification.success({
      message: 'success',
      description: 'Export success',
      duration: 2,
    });
  } else {
    notification.warning({
      message: 'warning',
      description: 'There is no report',
      duration: 2,
    });
  }
};

export const importData = (
  data: SupportedExportFormats,
): LatestExportFormat => {
  const cleanedData = cleanData(data);

  const conversations = cleanedData.history;
  localStorage.setItem('conversationHistory', JSON.stringify(conversations));
  localStorage.setItem(
    'selectedConversation',
    JSON.stringify(conversations[conversations.length - 1]),
  );

  localStorage.setItem('folders', JSON.stringify(cleanedData.folders));

  return cleanedData;
};
