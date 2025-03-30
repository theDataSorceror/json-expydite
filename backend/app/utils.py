import io
import csv
from uuid import uuid4
from genson import SchemaBuilder
from flatten_json import flatten

from datamodel_code_generator import DataModelType, PythonVersion
from datamodel_code_generator.model import get_data_model_types
from datamodel_code_generator.parser.jsonschema import JsonSchemaParser


def json_to_json_schema(input_json):
    input_dict = input_json.data
    builder = SchemaBuilder()
    builder.add_object(input_dict)
    json_schema = builder.to_schema()
    return json_schema


def key_cleaner(key):
    clean_key = key.replace("properties", "")[1:]
    clean_key = clean_key.replace("..", ".")
    clean_key = clean_key.replace(".type", "")
    clean_key = clean_key.replace("items", "")
    clean_key = clean_key[:-1] if clean_key[-1] == "." else clean_key
    return clean_key


def flat_schema_adjuster(flattened: dict):
    clean_entries = {}
    entries_being_processed = []
    clean_entry_array = []
    loop_start = True
    expecting_data_type = False
    key_counter = 0
    adjustable_keys = [key for key in flattened.keys() if key.startswith("properties")]
    key_in_process = adjustable_keys[-1]

    for key in adjustable_keys:
        clean_key = key_cleaner(key)
        entry = flattened[key]
        if "required" in key or entry == "object":
            continue
        if not loop_start and clean_key != key_in_process:
            key_counter = 0
            if key_counter == 0 and expecting_data_type:
                clean_item["type"] = None
                clean_entry_array.append(clean_item)
        if clean_key not in clean_entries.keys() and clean_key not in key_in_process:
            expecting_data_type = False
            clean_item = {"uid": str(uuid4()), "name": clean_key}
            if entry == "array":
                clean_item["array"] = True
                expecting_data_type = True
            else:
                clean_item["array"] = False
                clean_item["type"] = entry
        else:
            clean_item["type"] = entry
            expecting_data_type = False

        if "type" in clean_item.keys():
            clean_entries[clean_key] = "processed"
            clean_entry_array.append(clean_item)
        if clean_key not in entries_being_processed:
            entries_being_processed.append(clean_key)

        key_in_process = clean_key
        key_counter += 1
        loop_start = False
    return clean_entry_array


def csv_string_writer(clean_array: list):
    # Convert dictionary list to CSV string
    output = io.StringIO()
    fieldnames = clean_array[0].keys()
    writer = csv.DictWriter(output, fieldnames=fieldnames)

    writer.writeheader()
    writer.writerows(clean_array)

    csv_string = output.getvalue()
    return csv_string


def schema_to_flat_csv(json_schema: dict):
    flattened = flatten(json_schema, separator=".")
    adjusted_schema = flat_schema_adjuster(flattened)
    for entry in adjusted_schema:
        entry["Required"] = True
        entry["Default"] = None
    schema_csv = csv_string_writer(adjusted_schema)
    return schema_csv
