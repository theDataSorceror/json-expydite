import json
from fastapi import APIRouter, Body
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

