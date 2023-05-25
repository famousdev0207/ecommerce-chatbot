/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { IconArrowLeft } from '@tabler/icons-react';
import { FC, memo, useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Form,
  InputNumber,
  Spin,
  Upload,
  notification,
} from 'antd';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { PageSettings } from '@/types/settings';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import {
  bucketName,
  chunkSize,
  imagePath,
  maxTokenLength,
  pdfPath,
  s3Path,
  s3config,
  temperature,
  topp,
} from '@/config/constant';
import isEmpty from '@/utils/isEmpty';
import S3 from 'aws-sdk/clients/s3';

const { Dragger } = Upload;

interface Props {
  onToChatPage: (e: boolean) => void;
  setSettings: (setting: PageSettings) => void;
  settings: PageSettings;
  namespace: string;
  showSettingPage: boolean;
  key: string;
}

export const Settings: FC<Props> = memo(
  ({ settings, onToChatPage, namespace, showSettingPage, setSettings }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageList, setImageList] = useState<UploadFile[]>([]);
    const [pdfList, setPdfList] = useState<UploadFile[]>([]);
    const s3 = new S3(s3config);

    const onFinish = async (e: any) => {
      setSettings({
        chunkSize: e.chunkSize,
        maxTokenLength: e.maxTokenLength,
        temperature: e.temperature,
        topp: e.topp,
        avatar:
          imageList.length > 0
            ? {
                ...imageList[0],
                response: {
                  url: s3Path + imagePath + imageList[0].name.replace(' ', ''),
                },
              }
            : undefined,
      });
      onToChatPage(false);
    };

    const trainWithDocuments = async () => {
      const res: any = await fetch('api/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: localStorage.getItem('upload') }),
      });
    };

    useEffect(() => {
      form.setFieldsValue({
        chunkSize: settings.chunkSize,
        temperature: settings.temperature,
        maxTokenLength: settings.maxTokenLength,
        topp: settings.topp,
      });
      if (settings.avatar) {
        setImageList([settings.avatar]);
      }
    }, [showSettingPage]);

    const props = {
      name: 'test',
      multiple: true,
      action: '/api/upload',
      onChange: function (info: UploadChangeParam<UploadFile<any>>) {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(
            '----------------------------------',
            info.file,
            info.fileList,
          );
        }
        if (status === 'done') {
          notification.success({
            message: 'Success',
            description: 'Files were uploaded successfully',
            duration: 2,
          });
          console.log(`${info.file.name} file uploaded successfully.`);
          localStorage.setItem('upload', info.file.response.data);
        } else if (status === 'error') {
          notification.error({
            message: 'Error',
            description: 'Upload Error',
            duration: 2,
          });
          console.log(`${info.file.name} file upload failed.`);
        }
      },
    };

    const fileTypes = [
      {
        extensions: ['csv'],
        mimeTypes: ['text/csv'],
      },
      {
        extensions: ['xlsx'],
        mimeTypes: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
      },
    ];

    const uploadFilter = (file: any) => {
      const fileType = file.name
        .substring(file.name.lastIndexOf('.'))
        .toLowerCase();
      fileTypes.forEach((row) => {
        if (row.extensions.includes(fileType)) {
          return true;
        }
      });
      return false;
    };

    return (
      <div className="relative flex-1 overflow-auto bg-white dark:bg-[#343541]">
        {loading ? (
          <div className="dark:white absolute z-10 flex h-full w-full flex-col items-center justify-center">
            <Spin
              tip="Please wait..."
              size="large"
              className="spin-style"
              spinning={loading}
            ></Spin>
          </div>
        ) : (
          <></>
        )}
        <div className={loading ? 'opacity-50' : ''}>
          <button
            className="ml-16 mt-8 flex cursor-pointer items-center rounded-lg py-3 pl-2 pr-4 text-[14px] leading-3 text-black transition-colors duration-200 hover:bg-gray-500/10 dark:text-white"
            onClick={() => onToChatPage(false)}
          >
            <IconArrowLeft className="mr-2" />
            Back
          </button>
          <div className="flex justify-center pt-2">
            <div className="form-setting lg:w-[500px] md:w-[300px]">
              <div className="mb-8 text-center text-4xl font-bold text-black dark:text-white">
                Settings
              </div>
              <Divider className="border-black text-black dark:border-slate-400 dark:text-white">
                Train Data
              </Divider>
              <Form.Item
                label="Train Data"
                name="file"
                rules={[{ required: true }]}
                // initialValue="PDF"
              >
                <Dragger
                  {...props}
                  accept={'text/csv'}
                  maxCount={1}
                  //   beforeUpload={uploadFilter}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">Maximum size: 100MB</p>
                  {/* <p className="ant-upload-hint">Maximum count: 5</p> */}
                </Dragger>
                <div className="mt-4 flex justify-end">
                  <Button size="large" onClick={() => trainWithDocuments()}>
                    Train
                  </Button>
                </div>
              </Form.Item>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
Settings.displayName = 'Settings';
