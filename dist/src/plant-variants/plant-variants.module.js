"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantVariantsModule = void 0;
const common_1 = require("@nestjs/common");
const plant_variants_controller_1 = require("./plant-variants.controller");
const plant_variants_service_1 = require("./plant-variants.service");
const plant_variants_repository_1 = require("./plant-variants.repository");
const upload_module_1 = require("../upload/upload.module");
let PlantVariantsModule = class PlantVariantsModule {
};
exports.PlantVariantsModule = PlantVariantsModule;
exports.PlantVariantsModule = PlantVariantsModule = __decorate([
    (0, common_1.Module)({
        imports: [upload_module_1.UploadModule],
        controllers: [plant_variants_controller_1.PlantVariantsController],
        providers: [plant_variants_service_1.PlantVariantsService, plant_variants_repository_1.PlantVariantsRepository],
        exports: [plant_variants_service_1.PlantVariantsService],
    })
], PlantVariantsModule);
//# sourceMappingURL=plant-variants.module.js.map