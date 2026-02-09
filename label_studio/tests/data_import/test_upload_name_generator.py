import os
import re

import pytest
from data_import.models import FileUpload, upload_name_generator


pytestmark = pytest.mark.django_db


def _create_instance(project_id: int = 1) -> FileUpload:
    # FileUpload has required FKs, but for upload_to we only need project_id and the model meta.
    return FileUpload(project_id=project_id)


def test_upload_name_generator_default_prefixes_uuid(settings, tmp_path):
    settings.MEDIA_ROOT = str(tmp_path / 'media')
    settings.UPLOAD_DIR = 'upload'
    settings.PRESERVE_UPLOAD_FILENAMES = False

    instance = _create_instance(7)
    result = upload_name_generator(instance, 'DJI_20251129134442_0078_V_scratch-dirt.jpg')

    assert result.startswith('upload/7/')
    assert re.match(r"^upload/7/[0-9a-f]{8}-DJI_20251129134442_0078_V_scratch-dirt\.jpg$", result)


def test_upload_name_generator_preserves_basename_when_enabled(settings, tmp_path):
    settings.MEDIA_ROOT = str(tmp_path / 'media')
    settings.UPLOAD_DIR = 'upload'
    settings.PRESERVE_UPLOAD_FILENAMES = True

    instance = _create_instance(7)
    result = upload_name_generator(instance, 'DJI_20251129134442_0078_V_scratch-dirt.jpg')

    assert result == 'upload/7/DJI_20251129134442_0078_V_scratch-dirt.jpg'


def test_upload_name_generator_collision_uses_subfolder_not_prefix(settings, tmp_path):
    settings.MEDIA_ROOT = str(tmp_path / 'media')
    settings.UPLOAD_DIR = 'upload'
    settings.PRESERVE_UPLOAD_FILENAMES = True

    # Create an existing file to force a collision
    existing_path = tmp_path / 'media' / 'upload' / '7' / 'DJI.jpg'
    existing_path.parent.mkdir(parents=True, exist_ok=True)
    existing_path.write_bytes(b'test')

    instance = _create_instance(7)
    result = upload_name_generator(instance, 'DJI.jpg')

    assert result.startswith('upload/7/')
    assert result.endswith('/DJI.jpg')
    # Must not prefix the filename
    assert not re.match(r"^upload/7/[0-9a-f]{8}-DJI\.jpg$", result)
    # Must be in a subfolder: upload/7/<uuid8>/DJI.jpg
    assert re.match(r"^upload/7/[0-9a-f]{8}/DJI\.jpg$", result)

    # Local storage: the subfolder should exist because generator creates it
    subdir = result.split('/')[2]
    assert os.path.isdir(tmp_path / 'media' / 'upload' / '7' / subdir)
