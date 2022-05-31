import { useCallback } from 'react';
import { getOrNewFileHandle, writeFile } from './useFSA';

export function useImportMd(setValue: (content: string) => void) {
  const onImportMd = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.text, .txt, .md, .mkdn, .mdwn, .mdown, .markdown';
    input.multiple = false;

    input.onchange = async (e) => {
      if (!e.target) {
        return;
      }

      const inputElement = e.target as HTMLInputElement;
      const fileList = inputElement.files;

      if (!fileList) {
        return;
      }

      const content = await processImport(fileList);
      if (content) setValue(content);
    };

    input.click();
  }, [setValue]);

  return onImportMd;
}

/**
 * on Import Md 
 */
export const processImport = async (fileList: FileList | File[]) => {
  const file = fileList && fileList.length > 0 ? fileList[0] : null;
  if (!file) {
    return;
  }

  const fileName = file.name;
  const checkMd = checkFileIsMd(fileName);
  if (!fileName || !checkMd) {
    return;
  }

  const fileContent = await file.text();

  const fHandle = await getOrNewFileHandle(fileName);
  // save fileContent to File System
  if (fHandle) {
    await writeFile(fHandle, fileContent);
  }

  return fileContent;
};

/**
 * remove file name extension
 *
 * @param {string} fname, file name.
 */
export const rmFileNameExt = (fname: string) => {
  return fname.replace(/\.[^/.]+$/, '');
}

export const checkFileIsMd = (fname: string) => {
  const check = /\.(text|txt|md|mkdn|mdwn|mdown|markdown){1}$/i.test(fname);
  return check;
}
