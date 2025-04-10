import io
import csv
from uuid import uuid4
from genson import SchemaBuilder
from flatten_json import flatten

from datamodel_code_generator import DataModelType, PythonVersion
from datamodel_code_generator.model import get_data_model_types
from datamodel_code_generator.parser.jsonschema import JsonSchemaParser


def json_to_json_schema(input_json):
    input_dict = input_json
    builder = SchemaBuilder()
    builder.add_object(input_dict)
    json_schema = builder.to_schema()
    return json_schema


def key_cleaner(key, data_type):
    if data_type == "object":
        clean_key = key.replace("properties", "")[1:]
    else:
        clean_key = key.replace("items.", "")
        clean_key = clean_key.replace("properties", "")[1:]
    clean_key = clean_key.replace("..", ".")
    clean_key = clean_key.replace(".type", "")
    clean_key = clean_key.replace("items", "")
    clean_key = clean_key[:-1] if clean_key[-1] == "." else clean_key
    return clean_key


def empty_array_or_object_cleanup(clean_item, empty_object_warning):
    if not empty_object_warning:
        clean_item["Type"] = None
    else:
        clean_item["Type"] = "object"
    return clean_item


def clean_item_builder(clean_key, uuid, entry, expecting_data_type):
    empty_object_warning = False
    clean_item = {"uid": uuid, "Name": clean_key}
    if entry == "array":
        clean_item["Array"] = True
        expecting_data_type = True
    elif entry == "object":
        clean_item["Array"] = False
        expecting_data_type = True
        empty_object_warning = True
    else:
        clean_item["Array"] = False
        clean_item["Type"] = entry
    return clean_item, expecting_data_type, empty_object_warning


def flat_schema_adjuster(flattened: dict, data_type: str):
    metadata = {}
    clean_item = {}
    clean_entries = {}
    entries_being_processed = []
    clean_entry_array = []
    loop_start = True
    expecting_data_type = False
    key_counter = 0
    if data_type == "object":
        adjustable_keys = [
            key for key in flattened.keys() if key.startswith("properties")
        ]
    elif data_type == "array":
        adjustable_keys = [
            key for key in flattened.keys() if key.startswith("items.properties")
        ]

    else:
        return []

    unused_keys = [key for key in flattened.keys() if key not in adjustable_keys]
    for key in unused_keys:
        metadata[str(uuid4())] = {key: flattened[key]}

    key_in_process = adjustable_keys[-1]
    for key in adjustable_keys:

        clean_key = key_cleaner(key, data_type)
        entry = flattened[key]

        # if entry in ["integer", "double", "float"]:
        #     entry = "number"

        if "required" in key or "data" in key:
            metadata[str(uuid4())] = {key: flattened[key]}
            continue

        if key_in_process in key:
            empty_object_warning = False
            expecting_data_type = False

        if not loop_start and clean_key != key_in_process:
            key_counter = 0
            if key_counter == 0 and expecting_data_type:
                clean_item = empty_array_or_object_cleanup(
                    clean_item, empty_object_warning
                )
                clean_entry_array.append(clean_item)

        if clean_key not in clean_entries.keys() and clean_key not in key_in_process:
            expecting_data_type = False
            uuid = str(uuid4())
            metadata[uuid] = {key: flattened[key]}
            clean_item, expecting_data_type, empty_object_warning = clean_item_builder(
                clean_key, uuid, entry, expecting_data_type
            )
        else:
            metadata[str(uuid4())] = {key: flattened[key]}
            clean_item["Type"] = entry
            expecting_data_type = False

        if "Type" in clean_item.keys():
            clean_entries[clean_key] = "processed"
            clean_entry_array.append(clean_item)
        if clean_key not in entries_being_processed:
            entries_being_processed.append(clean_key)

        key_in_process = clean_key
        key_counter += 1
        loop_start = False

    if "Type" not in clean_item.keys() and key == adjustable_keys[-1]:
        clean_item = empty_array_or_object_cleanup(clean_item, empty_object_warning)
        clean_entry_array.append(clean_item)
    return clean_entry_array, metadata


def csv_string_writer(clean_array: list):
    # Convert dictionary list to CSV string
    output = io.StringIO()
    fieldnames = clean_array[0].keys()
    writer = csv.DictWriter(output, fieldnames=fieldnames)

    writer.writeheader()
    writer.writerows(clean_array)

    csv_string = output.getvalue()
    return csv_string


def schema_to_flat_csv(json_schema: dict, data_type: str):
    clean_schema = []
    flattened = flatten(json_schema, separator=".")
    adjusted_schema, metadata = flat_schema_adjuster(flattened, data_type)
    for item in adjusted_schema:
        if item != {"Type": "object"}:
            clean_schema.append(item)
            item["Required"] = True
            item["Default"] = None

    schema_csv = csv_string_writer(clean_schema)
    return schema_csv, metadata


def type_mismatch(label, data):
    error = False
    if label == "number":
        try:
            float(data)
        except:
            if data != "":
                error = True
    elif label == "boolean" and data not in ["True", "False", ""]:
        error = True
    elif label == "array" and data != [] and data != "":
        error = True
    elif label == "object" and data != {} and data != "":
        error = True
    else:
        pass
    return error


def error_reporter(csv_string):
    string_array = csv_string.split("\n")
    string_array = [string.replace("\r", "") for string in string_array]
    type_index = string_array[0].split(",").index("Type")
    default_index = string_array[0].split(",").index("Default")

    all_errors = []
    type_errors = []
    mismatch_errors = []
    i = 1
    for entry in string_array[1:-1]:
        values = entry.split(",")
        if values[type_index] == "":
            type_errors.append(f"Missing datatype on row {i}")
            i += 1
            continue
        if type_mismatch(values[type_index], values[default_index]):
            mismatch_errors.append(f"Type and Default mismatch on row {i}")
        i += 1

    all_errors.extend(type_errors)
    all_errors.extend(mismatch_errors)

    return all_errors
