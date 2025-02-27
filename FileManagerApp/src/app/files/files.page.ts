import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

interface FileItem {
  name: string;
  content: string;
}

@Component({
  standalone: false,
  selector: 'app-files',
  templateUrl: './files.page.html',
  styleUrls: ['./files.page.scss'],
})
export class FilesPage {
  fileList: FileItem[] = [];

  constructor(private storage: Storage) {
    this.loadFiles();
  }

  async loadFiles() {
    const storedFiles = await this.storage.get('files');
    if (storedFiles) {
      this.fileList = storedFiles;
    }
  }
}
