import json
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

from app.utils import *

router = APIRouter()


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


@router.post("/buildModel")
async def inspect_schema(input_json: JSONInput):
    schema = json_to_json_schema(input_json)
    csv_schema = schema_to_flat_csv(schema)
    return {"message": "Schema defined successfully",
            "data": csv_schema
            }


