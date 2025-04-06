import json
from fastapi import APIRouter, Body, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, List, Any

from app.utils import *

router = APIRouter()


class ArrayInput(BaseModel):
    data: List[Any]


class JSONInput(BaseModel):
    data: Dict[str, Any]


class PublishRequest(BaseModel):
    csvData: str  # Expected CSV data in a string format


@router.get("/health")
async def health_check():
    return {"status": "healthy"}


@router.post("/validate")
async def validate_json(input_data: JSONInput):
    print(input_data)
    return {
        "message": "JSON received",
        "data": input_data.model_dump(),
        "isValid": True,
    }


@router.post("/buildModelObject")
async def inspect_schema(input_json: JSONInput):
    data_type = "object"
    schema = json_to_json_schema(input_json.data)
    csv_schema = schema_to_flat_csv(schema, data_type)
    return {"message": "Schema defined successfully", "data": csv_schema}


@router.post("/buildModelArray")
async def build_model_array(data: List[Any] = Body(...)):
    data_type = "array"
    schema = json_to_json_schema(data)
    csv_schema = schema_to_flat_csv(schema, data_type)
    return {"message": "Schema defined successfully", "data": csv_schema}


@router.post("/publishTableData")
async def publish_table_data(request: PublishRequest):
    try:
        # Read raw CSV data from request body
        csv_string = request.csvData

        validation_errors = error_reporter(csv_string)
        if len(validation_errors)>0:
            return JSONResponse(
                status_code=200, content={"success": False, "errors": validation_errors}
            )

        # Parse CSV string
        # pydantic_string = ""
        # json_schema = csv_to_full_json_schema(csv_schema)
        # model = build_pydantic_model(json_schema)
        # pydantic_string = pydantic_to_string(model)

        print("Received Finalized Model:")  # Debugging log

        return JSONResponse(
            content={
                "message": "Model finalized successfully",
                "data": "",
                "success":True
            },
            status_code=200,
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV: {str(e)}")
