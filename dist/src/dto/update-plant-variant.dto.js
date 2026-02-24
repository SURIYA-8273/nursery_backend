"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePlantVariantDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_plant_variant_dto_1 = require("./create-plant-variant.dto");
class UpdatePlantVariantDto extends (0, mapped_types_1.PartialType)(create_plant_variant_dto_1.CreatePlantVariantDto) {
}
exports.UpdatePlantVariantDto = UpdatePlantVariantDto;
//# sourceMappingURL=update-plant-variant.dto.js.map