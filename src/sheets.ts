import { google } from "googleapis";
import { client_email, private_key } from "../gs-api-test-7f8f4db8dd1c.json";

export class GoogleSheets {
  constructor(private spreadsheetId: string) {}

  private init() {
    const client = new google.auth.JWT(client_email, null, private_key, [
      "https://www.googleapis.com/auth/spreadsheets",
    ]);
    return client;
  }

  async createSheet(title: string) {
    const client = this.init();
    client.authorize(async (error, result) => {
      if (error) {
        return console.error(error);
      }
      const gsapi = google.sheets({ version: "v4", auth: client });
      let response = await gsapi.spreadsheets.batchUpdate({
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title },
              },
            },
          ],
        },
        spreadsheetId: this.spreadsheetId,
      });
      console.log(response);
      return response;
    });
  }

  async update<T>(sheet: string, values: T[]) {
    const client = this.init();
    client.authorize(async (error, result) => {
      if (error) {
        return console.error(error);
      }
      const gsapi = google.sheets({ version: "v4", auth: client });
      const updateOptions = {
        spreadsheetId: this.spreadsheetId,
        range: `${sheet}!A1:Z`,
        valueInputOption: "USER_ENTERED",
        resource: { values },
      };
      let response = await gsapi.spreadsheets.values.update(updateOptions);
      console.log(response);
      return response;
    });
  }

  async getValues(sheet: string) {
    const client = this.init();
    client.authorize(async (error, result) => {
      if (error) {
        return console.error(error);
      }
      const gsapi = google.sheets({ version: "v4", auth: client });
      const options = {
        spreadsheetId: this.spreadsheetId,
        range: `${sheet}!A1:Z`,
      };
      let response = await gsapi.spreadsheets.values.get(options);
      console.log(response);
      return response;
    });
  }

  postToGoogleSheets<T>(sheet: string, values: T[]) {
    this.createSheet(sheet);
    setTimeout(() => {
      this.update(sheet, values);
    }, 2000);
  }
}