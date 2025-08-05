import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftDto, UpdateShiftDto, ClockDto, ShiftResponseDto } from './shift.dto';

@Controller('shifts')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createShiftDto: CreateShiftDto): Promise<ShiftResponseDto> {
    return this.shiftService.create(createShiftDto);
  }

  @Get()
  async findAll(@Query() query: any): Promise<{ data: ShiftResponseDto[], total: number, page: number, limit: number }> {
    return this.shiftService.findAll({
      employeeId: query.employeeId,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
      shiftTypeId: query.shiftTypeId,
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 15,
    });
  }

  @Get('employee/:employeeId')
  async findByEmployee(
    @Param('employeeId') employeeId: string,
    @Query() query: any
  ): Promise<{ data: ShiftResponseDto[], total: number, page: number, limit: number }> {
    return this.shiftService.findByEmployeeId(employeeId, {
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 15,
    });
  }

  @Get('employee/:employeeId/today')
  async findTodayShift(@Param('employeeId') employeeId: string): Promise<ShiftResponseDto> {
    return this.shiftService.findTodayShift(employeeId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ShiftResponseDto> {
    return this.shiftService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateShiftDto: UpdateShiftDto): Promise<ShiftResponseDto> {
    return this.shiftService.update(id, updateShiftDto);
  }

  @Patch(':id/clock')
  async updateClock(@Param('id') id: string, @Body() clockDto: ClockDto): Promise<ShiftResponseDto> {
    return this.shiftService.updateClock(id, clockDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.shiftService.remove(id);
  }
}