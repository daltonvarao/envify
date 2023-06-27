export class Storage {
  private repository = chrome.storage.local;

  async save(data: Record<string, any>) {
    await this.repository.set(data);
  }

  async find(data: Record<string, any>) {
    return await this.repository.get(data);
  }

  async delete(key: string) {
    await chrome.storage.local.remove(key);
  }
}

export default Storage;
