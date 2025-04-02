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
    return {"message": "Schema defined successfully",
            "data": csv_schema
            }

@router.post("/buildModelArray")
async def build_model_array(data: List[Any]= Body(...)):
    data_type = "array"
    schema = json_to_json_schema(data)
    csv_schema = schema_to_flat_csv(schema, data_type)
    return {"message": "Schema defined successfully",
            "data": csv_schema
            }


@router.post("/finalizeModel")
async def finalize_model(request: Request):
    try:
        # Read raw CSV data from request body
        csv_data = await request.body()
        csv_string = csv_data.decode("utf-8")  # Decode bytes to string
        
        # Parse CSV string
        csv_schema = csv.reader(io.StringIO(csv_string))
        pydantic_string = ""
        # json_schema = csv_to_full_json_schema(csv_schema)
        # model = build_pydantic_model(json_schema)
        # pydantic_string = pydantic_to_string(model)

        print("Received Finalized Model:")  # Debugging log

        return JSONResponse(content={"message": "Model finalized successfully", 
                                     "data":pydantic_string}, 
                                     status_code=200)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV: {str(e)}")