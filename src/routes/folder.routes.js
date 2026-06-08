import { Router } from "express";
import { addUpdateFolderName } from "../controller/folder.controller.js";
const router = Router();

router.post(
  "/add-folder-name",
  /*
    #swagger.tags = ['11.Folder']
    #swagger.summary = 'Add or Update Folder'

    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              user_id: {type: "string" , example: "USER_Yl_e5736"},
              folder_name : {type : "string" , example :"ABC folder"}
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Folder name saved successfully'
    }

   

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */
  addUpdateFolderName,
);

export default router;
